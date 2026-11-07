/* Optional local stub if CDN blocked. Prefer Telegram CDN in layout. */
(function () {
  if (typeof window === "undefined") return;
  if (window.Telegram && window.Telegram.WebApp) return;
  window.Telegram = {
    WebApp: {
      initData: "",
      initDataUnsafe: { user: { id: 0, first_name: "Dev", username: "devuser" } },
      ready: function () {},
      expand: function () {},
      themeParams: {},
    },
  };
})();
