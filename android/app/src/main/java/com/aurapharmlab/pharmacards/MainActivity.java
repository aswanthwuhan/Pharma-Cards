package com.aurapharmlab.pharmacards;

import android.graphics.Rect;
import android.net.Uri;
import android.os.Build;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ServiceWorkerClient;
import android.webkit.ServiceWorkerController;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Map;
import java.util.regex.Pattern;

public class MainActivity extends BridgeActivity {

    // Each edge strip is EDGE_BAND_DP wide and GESTURE_BAND_DP tall (the system cap per edge).
    private static final float EDGE_BAND_DP = 48f;
    private static final float GESTURE_BAND_DP = 200f;
    // Route paths such as /study or /settings. Dots are excluded, so real files pass through.
    private static final Pattern ROUTE = Pattern.compile("/[A-Za-z0-9_/-]*[A-Za-z0-9_-]");

    @Override
    protected void load() {
        super.load();
        bridge.setWebViewClient(new RouteWebViewClient(bridge));
        // Service worker fetches (offline navigation fallback) skip the WebViewClient, so route them too.
        ServiceWorkerController.getInstance().setServiceWorkerClient(new ServiceWorkerClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) {
                return bridge.getLocalServer().shouldInterceptRequest(toRouteAsset(request));
            }
        });
        bridge.getWebView().addOnLayoutChangeListener(
            (v, l, t, r, b, ol, ot, or, ob) -> updateGestureExclusion(v)
        );
        bridge.getWebView().addJavascriptInterface(new ExitBridge(), "PharmaNative");
    }

    // The web app decides what Back does (history step, or the close-app prompt on home).
    // It returns false when it is not ready, and then the WebView or the activity handles it.
    @Override
    public void onBackPressed() {
        bridge.getWebView().evaluateJavascript("window.__nativeBack ? window.__nativeBack() : false", result -> {
            if ("true".equals(result)) return;
            if (bridge.getWebView().canGoBack()) bridge.getWebView().goBack();
            else finish();
        });
    }

    private class ExitBridge {
        @JavascriptInterface
        public void exit() {
            runOnUiThread(MainActivity.this::finish);
        }
    }

    // Capacitor serves index.html for every dot-less path, so a full load of /study
    // would show home. Serve the route's own exported <route>.html instead.
    private class RouteWebViewClient extends BridgeWebViewClient {

        RouteWebViewClient(Bridge bridge) {
            super(bridge);
        }

        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            return super.shouldInterceptRequest(view, toRouteAsset(request));
        }
    }

    // Maps a page request for /study to the exported study.html; anything else passes through unchanged.
    private WebResourceRequest toRouteAsset(WebResourceRequest request) {
        Uri url = request.getUrl();
        String path = url.getPath();
        if (!isPageRequest(request) || !"GET".equals(request.getMethod()) || path == null) return request;
        String route = path.replaceAll("/+$", "");
        if (!ROUTE.matcher(route).matches() || !assetExists("public" + route + ".html")) return request;
        return withUrl(request, url.buildUpon().path(route + ".html").build());
    }

    private static boolean isPageRequest(WebResourceRequest request) {
        if (request.isForMainFrame()) return true;
        for (Map.Entry<String, String> h : request.getRequestHeaders().entrySet()) {
            if (h.getKey().equalsIgnoreCase("Accept") && h.getValue() != null && h.getValue().contains("text/html")) return true;
        }
        return false;
    }

    private boolean assetExists(String name) {
        try (InputStream in = getAssets().open(name)) {
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    private static WebResourceRequest withUrl(WebResourceRequest original, Uri url) {
        return new WebResourceRequest() {
            @Override
            public Uri getUrl() {
                return url;
            }

            @Override
            public boolean isForMainFrame() {
                return original.isForMainFrame();
            }

            @Override
            public boolean isRedirect() {
                return original.isRedirect();
            }

            @Override
            public boolean hasGesture() {
                return original.hasGesture();
            }

            @Override
            public String getMethod() {
                return original.getMethod();
            }

            @Override
            public Map<String, String> getRequestHeaders() {
                return original.getRequestHeaders();
            }
        };
    }

    // Keeps the back gesture from taking swipes that start at the screen edges, where the card is swiped.
    private void updateGestureExclusion(View view) {
        if (Build.VERSION.SDK_INT < 29) return;
        int width = view.getWidth();
        int height = view.getHeight();
        if (width == 0 || height == 0) return;
        float density = getResources().getDisplayMetrics().density;
        int band = Math.round(EDGE_BAND_DP * density);
        int half = Math.round(GESTURE_BAND_DP * density / 2f);
        int top = Math.max(0, height / 2 - half);
        int bottom = Math.min(height, height / 2 + half);
        view.setSystemGestureExclusionRects(
            Arrays.asList(new Rect(0, top, band, bottom), new Rect(width - band, top, width, bottom))
        );
    }
}
