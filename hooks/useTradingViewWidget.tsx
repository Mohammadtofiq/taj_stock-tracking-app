"use client"
import { useEffect, useRef } from "react"

const useTradingViewWidget = (scriptUrl: string, config: Record<string, unknown>, height = 600) => {
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!containerRef.current) return
        
        const container = containerRef.current;
        const widgetDiv = container.querySelector('.tradingview-widget-container__widget') as HTMLDivElement;
        
        if (!widgetDiv) return
        
        // Check if already loaded
        if (container.dataset.loaded === 'true') return

        // Clear any existing content in the widget div
        widgetDiv.innerHTML = '';

        // Create and configure the script
        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        script.type = "text/javascript";
        script.innerHTML = JSON.stringify(config);

        // Append script to the widget container
        widgetDiv.appendChild(script);
        container.dataset.loaded = 'true';

        // Cleanup function
        return () => {
            if (container && widgetDiv) {
                // Remove all scripts and iframes
                const scripts = widgetDiv.querySelectorAll('script');
                const iframes = widgetDiv.querySelectorAll('iframe');
                scripts.forEach(s => s.remove());
                iframes.forEach(i => i.remove());
                widgetDiv.innerHTML = '';
                delete container.dataset.loaded;
            }
        }
    }, [scriptUrl, config, height])

    return containerRef;
}

export default useTradingViewWidget