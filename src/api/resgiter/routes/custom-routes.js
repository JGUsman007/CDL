module.exports = {
  routes: [
    {
      method: "POST",
      path: "/signup",
      handler: "resgiter.signup",
    },
    {
      method: "POST",
      path: "/login",
      handler: "resgiter.login",
    },
  ],
};
