/**
 * Awwwards Motion Ecosystem - Unified Exports
 * Covers all 20 core effects for camcu-cafe
 */

// Tokens
export * from "./tokens";

// Group 1: Core & Scroll Reveals (Effects 1 - 10)
export { default as PageTransitionLayout } from "./PageTransitionLayout";
export { default as Reveal } from "./core/Reveal";
export type { RevealProps, RevealVariant } from "./core/Reveal";
export { default as Parallax } from "./core/Parallax";
export type { ParallaxProps } from "./core/Parallax";
export { default as HeroStagger, HeroItem } from "./core/HeroStagger";
export type { HeroStaggerProps } from "./core/HeroStagger";
export { default as TextReveal } from "./core/TextReveal";
export type { TextRevealProps } from "./core/TextReveal";
export { default as ImageReveal } from "./core/ImageReveal";
export type { ImageRevealProps } from "./core/ImageReveal";

// Group 2: Interactive & Hover (Effects 11 - 17)
export { default as TiltCard } from "./interactive/TiltCard";
export type { TiltCardProps } from "./interactive/TiltCard";
export { default as MagneticButton } from "./interactive/MagneticButton";
export type { MagneticButtonProps } from "./interactive/MagneticButton";
export { default as MotionCarousel } from "./interactive/MotionCarousel";
export type { MotionCarouselProps } from "./interactive/MotionCarousel";
export { default as SkeletonShimmer } from "./interactive/SkeletonShimmer";
export type { SkeletonShimmerProps } from "./interactive/SkeletonShimmer";

// Group 3: Layout Transitions (Effects 13 - 15)
export { default as NavbarMotion } from "./layout/NavbarMotion";
export type { NavbarMotionProps } from "./layout/NavbarMotion";
export { default as ModalMotion } from "./layout/ModalMotion";
export type { ModalMotionProps } from "./layout/ModalMotion";
export { default as AccordionMotion } from "./layout/AccordionMotion";
export type { AccordionMotionProps } from "./layout/AccordionMotion";

// Group 4: Special Systems & Micro-Interactions (Effects 18 - 20)
export { default as CustomCursor } from "../ui/CustomCursor";
export { default as AuroraBackground } from "./special/AuroraBackground";
export type { AuroraBackgroundProps } from "./special/AuroraBackground";
export {
  LikeButton,
  AnimatedCheckmark,
  SmoothToggle,
} from "./special/MicroInteractions";
