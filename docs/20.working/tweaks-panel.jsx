/* ============================================================
   tweaks-panel.jsx
   Generic tweak panel + hooks + controls. Exposes via window.*
   Host postMessage protocol implemented here.
   ============================================================ */

(function () {
  const { useState, useEffect, useRef, useCallback } = React;

  /* ---------- host protocol ---------- */
  function useTweaks(defaults) {
    const [values, setValues] = useState(defaults);
    const setTweak = useCallback((keyOrObj, val) => {
      setValues((prev) => {
        const patch = typeof keyOrObj === "string" ? { [keyOrObj]: val } : keyOrObj;
        const next = { ...prev, ...patch };
        try {
          window.parent &&
            window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
        } catch (e) {}
        return next;
      });
    }, []);
    return [values, setTweak];
  }

  function TweaksPanel({ open, onClose, title = "Tweaks", children }) {
    const ref = useRef(null);
    const dragRef = useRef({ x: 0, y: 0, dx: 0, dy: 0, on: false });
    const [pos, setPos] = useState(null);

    useEffect(() => {
      // announce availability AFTER mount so host toolbar appears
      try {
        window.parent &&
          window.parent.postMessage({ type: "__edit_mode_available" }, "*");
      } catch (e) {}
    }, []);

    useEffect(() => {
      function onMove(e) {
        if (!dragRef.current.on) return;
        setPos({
          x: e.clientX - dragRef.current.dx,
          y: e.clientY - dragRef.current.dy,
        });
      }
      function onUp() { dragRef.current.on = false; }
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      return () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
    }, []);

    function startDrag(e) {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      dragRef.current = { on: true, dx: e.clientX - r.left, dy: e.clientY - r.top };
    }

    if (!open) return null;
    const style = pos
      ? { left: pos.x, top: pos.y, right: "auto", bottom: "auto" }
      : { right: 24, bottom: 24 };

    return (
      <div
        ref={ref}
        className="__tweaks-panel"
        style={{
          position: "fixed",
          width: 312,
          maxHeight: "82vh",
          overflowY: "auto",
          background: "white",
          color: "#1a1815",
          borderRadius: 16,
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.06)",
          zIndex: 9999,
          fontSize: 13,
          ...style,
        }}
      >
        <div
          onMouseDown={startDrag}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 14px", borderBottom: "1px solid rgba(0,0,0,0.08)",
            cursor: "move", userSelect: "none",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 13 }}>{title}</div>
          <button
            onClick={() => {
              onClose && onClose();
              try {
                window.parent &&
                  window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*");
              } catch (e) {}
            }}
            style={{
              border: "none", background: "transparent", fontSize: 18,
              cursor: "pointer", lineHeight: 1, color: "#666",
            }}
          >×</button>
        </div>
        <div style={{ padding: "10px 14px 16px" }}>{children}</div>
      </div>
    );
  }

  function TweakSection({ title, children }) {
    return (
      <div style={{ marginTop: 14 }}>
        {title && (
          <div style={{
            fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
            color: "#888", marginBottom: 8, fontWeight: 600,
          }}>{title}</div>
        )}
        <div style={{ display: "grid", gap: 10 }}>{children}</div>
      </div>
    );
  }

  function Label({ children }) {
    return (
      <div style={{ fontSize: 12, color: "#444", marginBottom: 6, fontWeight: 500 }}>
        {children}
      </div>
    );
  }

  function TweakColor({ label, value, onChange, options }) {
    const isPalette = Array.isArray(options[0]);
    return (
      <div>
        {label && <Label>{label}</Label>}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {options.map((opt, i) => {
            const active = JSON.stringify(opt) === JSON.stringify(value);
            if (isPalette) {
              const [a, ...rest] = opt;
              return (
                <button
                  key={i}
                  onClick={() => onChange(opt)}
                  style={{
                    width: 64, height: 40, borderRadius: 10, border: "none",
                    padding: 0, overflow: "hidden", cursor: "pointer",
                    outline: active ? "2px solid #1a1815" : "1px solid rgba(0,0,0,0.1)",
                    outlineOffset: 2, position: "relative",
                  }}
                >
                  <div style={{ background: a, width: "100%", height: "60%" }} />
                  <div style={{ display: "flex", height: "40%" }}>
                    {rest.map((c, j) => (
                      <div key={j} style={{ background: c, flex: 1 }} />
                    ))}
                  </div>
                </button>
              );
            }
            return (
              <button
                key={i}
                onClick={() => onChange(opt)}
                style={{
                  width: 28, height: 28, borderRadius: "50%", background: opt,
                  border: "none", cursor: "pointer",
                  outline: active ? "2px solid #1a1815" : "1px solid rgba(0,0,0,0.15)",
                  outlineOffset: 2,
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }

  function TweakRadio({ label, value, onChange, options }) {
    const single = options.every((o) => String(o.label || o).length < 14) && options.length <= 3;
    if (!single) return <TweakSelect label={label} value={value} onChange={onChange} options={options} />;
    return (
      <div>
        {label && <Label>{label}</Label>}
        <div style={{
          display: "grid", gridTemplateColumns: `repeat(${options.length}, 1fr)`,
          background: "rgba(0,0,0,0.05)", borderRadius: 10, padding: 3,
        }}>
          {options.map((o, i) => {
            const v = o.value !== undefined ? o.value : o;
            const l = o.label !== undefined ? o.label : o;
            const active = v === value;
            return (
              <button
                key={i}
                onClick={() => onChange(v)}
                style={{
                  background: active ? "white" : "transparent",
                  color: active ? "#1a1815" : "#666",
                  border: "none", padding: "7px 8px", borderRadius: 8,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
                }}
              >{l}</button>
            );
          })}
        </div>
      </div>
    );
  }

  function TweakSelect({ label, value, onChange, options }) {
    return (
      <div>
        {label && <Label>{label}</Label>}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%", padding: "8px 10px", borderRadius: 8,
            border: "1px solid rgba(0,0,0,0.15)", fontSize: 13, fontFamily: "inherit",
          }}
        >
          {options.map((o, i) => {
            const v = o.value !== undefined ? o.value : o;
            const l = o.label !== undefined ? o.label : o;
            return <option key={i} value={v}>{l}</option>;
          })}
        </select>
      </div>
    );
  }

  function TweakToggle({ label, value, onChange }) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#444", fontWeight: 500 }}>{label}</span>
        <button
          onClick={() => onChange(!value)}
          style={{
            width: 38, height: 22, borderRadius: 999, border: "none",
            background: value ? "#143d2c" : "rgba(0,0,0,0.15)",
            position: "relative", cursor: "pointer", transition: "background .15s",
          }}
        >
          <span style={{
            position: "absolute", top: 3, left: value ? 19 : 3,
            width: 16, height: 16, borderRadius: "50%", background: "white",
            transition: "left .15s",
          }} />
        </button>
      </div>
    );
  }

  function TweakSlider({ label, value, onChange, min = 0, max = 100, step = 1, suffix = "" }) {
    return (
      <div>
        {label && (
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: "#444", fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: 11, color: "#888", fontFamily: "ui-monospace, monospace" }}>
              {value}{suffix}
            </span>
          </div>
        )}
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ width: "100%", accentColor: "#143d2c" }}
        />
      </div>
    );
  }

  /* listen for host activate/deactivate. Components opt in via window.__tweakOpen */
  let _setOpenExternal = null;
  function useTweakOpen(initial = false) {
    const [open, setOpen] = useState(initial);
    useEffect(() => {
      _setOpenExternal = setOpen;
      function onMsg(e) {
        const d = e.data || {};
        if (d.type === "__activate_edit_mode") setOpen(true);
        if (d.type === "__deactivate_edit_mode") setOpen(false);
      }
      window.addEventListener("message", onMsg);
      return () => {
        window.removeEventListener("message", onMsg);
        _setOpenExternal = null;
      };
    }, []);
    return [open, setOpen];
  }

  Object.assign(window, {
    useTweaks, useTweakOpen,
    TweaksPanel, TweakSection,
    TweakColor, TweakRadio, TweakToggle, TweakSlider, TweakSelect,
  });
})();
