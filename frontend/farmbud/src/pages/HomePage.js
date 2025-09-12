import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import FarmBudLogo from '../assets/FarmBudLogo.png'; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

export default function HomePage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center flex-grow px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* --- MODIFIED: Using the logo as the main heading --- */}
      <motion.div variants={itemVariants}>
        <img src={FarmBudLogo} alt="FarmBud Logo" className="w-64 mx-auto mb-4" />
      </motion.div>

      <motion.p
        className="mt-4 max-w-xl text-lg text-gray-300"
        variants={itemVariants}
      >
        Your personal farming assistant. Get intelligent crop recommendations based on soil and weather conditions to maximize your yield.
      </motion.p>
      <motion.div className="mt-8" variants={itemVariants}>
        <Button asChild size="lg">
          <Link to="/predict">Get Started</Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}