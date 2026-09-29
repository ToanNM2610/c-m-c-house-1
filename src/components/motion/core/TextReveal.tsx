"use client";

import React from "react";
import { motion } from "framer-motion";
import { EASINGS } from "../tokens";

export interface TextRevealProps {
  text: string;
  type?: "words" | "chars";
  stagger?: number;
  delay?: number;
  once?: boolean;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
}

/**
 * TextReveal (Effect 9):
 * Split-word / Split-character kinetic mask animation.
 */
export default function TextReveal({
  text,
  type = "words",
  stagger = 0.035,
  delay = 0,
  once = true,
  className = "",
  as: Component = "span",
}: TextRevealProps) {
  const items = type === "words" ? text.split(" ") : Array.from(text);

  return (
    <Component className={`inline-block ${className}`}>
      <motion.span
        initial="initial"
        whileInView="animate"
        viewport={{ once, margin: "-10%" }}
        className="inline-block"
      >
        {items.map((item, i) => (
          <span
            key={i}
            className={`inline-block overflow-hidden align-top ${
              type === "words" ? "mr-[0.28em]" : ""
            }`}
          >
            <motion.span
              className="inline-block"
              variants={{
                initial: { y: "115%", opacity: 0, rotate: 1.5 },
                animate: {
                  y: "0%",
                  opacity: 1,
                  rotate: 0,
                  transition: {
                    duration: 0.75,
                    delay: delay + i * stagger,
                    ease: EASINGS.cinematic,
                  },
                },
              }}
              style={{ willChange: "transform, opacity" }}
            >
              {item === " " ? "\u00A0" : item}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
}
