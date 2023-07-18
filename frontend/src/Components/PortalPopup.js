import { useMemo, useCallback, useState, useRef, useEffect } from "react";

import { createPortal } from "react-dom";
import styles from "./PortalPopup.module.css";

// PortalPopup Component
const PortalPopup = ({
  children,
  overlayColor,
  placement = "Centered",
  onOutsideClick,
  zIndex = 100,
  left = 0,
  right = 0,
  top = 0,
  bottom = 0,
  relativeLayerRef,
}) => {
  // Initializing states
  const relContainerRef = useRef(null);
  const [relativeStyle, setRelativeStyle] = useState({
    opacity: 0,
  });
  // Initializing memo
  const popupStyle = useMemo(() => {
    const style = {};
    style.zIndex = zIndex;

    if (overlayColor) {
      style.backgroundColor = overlayColor;
    }
    if (!relativeLayerRef?.current) {
      switch (placement) {
        case "Centered":
          style.alignItems = "center";
          style.justifyContent = "center";
          break;
        case "Top left":
          style.alignItems = "flex-start";
          break;
        case "Top center":
          style.alignItems = "center";
          break;
        case "Top right":
          style.alignItems = "flex-end";
          break;
        case "Bottom left":
          style.alignItems = "flex-start";
          style.justifyContent = "flex-end";
          break;
        case "Bottom center":
          style.alignItems = "center";
          style.justifyContent = "flex-end";
          break;
        case "Bottom right":
          style.alignItems = "flex-end";
          style.justifyContent = "flex-end";
          break;
        default:
      }
    }
    style.opacity = 1;
    return style;
  }, [placement, overlayColor, zIndex, relativeLayerRef]);

  // useCallback to set position
  const setPosition = useCallback(() => {
    const relativeItem = relativeLayerRef?.current?.getBoundingClientRect();
    const containerItem = relContainerRef?.current?.getBoundingClientRect();
    const style = { opacity: 1 };
    if (relativeItem && containerItem) {
      const {
        x: relativeX,
        y: relativeY,
        width: relativeW,
        height: relativeH,
      } = relativeItem;
      const { width: containerW, height: containerH } = containerItem;
      style.position = "absolute";
      switch (placement) {
        case "Top left":
          style.top = relativeY - containerH - top;
          style.left = relativeX + left;
          break;
        case "Top right":
          style.top = relativeY - containerH - top;
          style.left = relativeX + relativeW - containerW - right;
          break;
        case "Bottom left":
          style.top = relativeY + relativeH + bottom;
          style.left = relativeX + left;
          break;
        case "Bottom right":
          style.top = relativeY + relativeH + bottom;
          style.left = relativeX + relativeW - containerW - right;
          break;
        default:
      }

      setRelativeStyle(style);
    } else {
      style.maxWidth = "90%";
      style.maxHeight = "90%";
      setRelativeStyle(style);
    }
  }, [left, right, top, bottom, placement, relativeLayerRef, relContainerRef]);

  // useEffect to set default settings
  useEffect(() => {
    setPosition();

    window.addEventListener("resize", setPosition);
    window.addEventListener("scroll", setPosition, true);

    return () => {
      window.removeEventListener("resize", setPosition);
      window.removeEventListener("scroll", setPosition, true);
    };
  }, [setPosition]);

  // Handle modal outside click
  const onOverlayClick = useCallback(
    (e) => {
      if (
        onOutsideClick &&
        e.target.classList.contains(styles.portalPopupOverlay)
      ) {
        onOutsideClick();
      }
      e.stopPropagation();
    },
    [onOutsideClick]
  );

  // Render the component
  return (
    <Portal>
      <div
        className={styles.portalPopupOverlay}
        style={popupStyle}
        onClick={onOverlayClick}
      >
        <div ref={relContainerRef} style={relativeStyle}>
          {children}
        </div>
      </div>
    </Portal>
  );
};

// Export portal
export const Portal = ({ children, containerId = "portals" }) => {
  let portalsDiv = document.getElementById(containerId);
  if (!portalsDiv) {
    portalsDiv = document.createElement("div");
    portalsDiv.setAttribute("id", containerId);
    document.body.appendChild(portalsDiv);
  }

  return createPortal(children, portalsDiv);
};
export default PortalPopup;