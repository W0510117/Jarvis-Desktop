import { motion } from "framer-motion";
import states from "./states";
import "./ThinkingEntity.css";

export default function ThinkingEntity({ state }) {
  return (
    <motion.div
      className="thinking-entity"
      animate={states[state]}
      transition={{ duration: 0.6 }}
    />
  );
}
