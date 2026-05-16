import { motion } from 'framer-motion'

const transition = {
  type: 'spring',
  stiffness: 120,
  damping: 18,
}

function PageTransition({ children, className = '' }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={transition}
    >
      {children}
    </motion.section>
  )
}

export default PageTransition
