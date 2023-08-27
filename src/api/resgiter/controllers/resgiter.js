"use strict";

const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::resgiter.resgiter",
  ({ strapi }) => ({
    async signup(ctx) {
      try {
        const validationSchema = Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
        });

        const { error } = validationSchema.validate(ctx.request.body.data);

        if (error) {
          return ctx.throw(400, error.details[0].message);
        }

        const { email, password } = ctx.request.body.data;

        const existingUser = await strapi.db
          .query("api::resgiter.resgiter")
          .findOne({
            where: {
              email: email,
            },
          });

        if (existingUser) {
          return ctx.throw(400, "Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Creating user with data:", {
          email: email,
          password: hashedPassword,
        });

        const user = await strapi.db.query("api::resgiter.resgiter").create({
          data: {
            email: email,
            password: hashedPassword,
          },
        });

        return ctx.send({ message: "User registered successfully!", user });
      } catch (error) {
        console.error("Signup Error", error.status);
        ctx.throw(error.status, error.message);
      }
    },

    async login(ctx) {
      try {
        const validationSchema = Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
        });

        const { error } = validationSchema.validate(ctx.request.body.data);

        if (error) {
          return ctx.throw(400, error.details[0].message);
        }

        const { email, password } = ctx.request.body.data;

        const user = await strapi.db.query("api::resgiter.resgiter").findOne({
          where: {
            email: email,
          },
        });

        if (!user) {
          return ctx.throw(400, "User not found");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return ctx.throw(400, "Incorrect password");
        }

        // Here you can generate a JWT token and send it back for future authentication.

        return ctx.send({ message: "Logged in successfully!" });
      } catch (error) {
        console.error("Login Error", error);
        ctx.throw(error.status, error.message);
      }
    },
  })
);
