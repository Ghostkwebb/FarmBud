import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import FarmBudLogo from '../assets/FarmBudLogo.png';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import WeatherPieChart from '../components/charts/WeatherPieChart';
import DiseaseBarChart from '../components/charts/DiseaseBarChart';
import AccessBarChart from '../components/charts/AccessBarChart';

export default function HomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
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

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="w-full">
      {/* --- Section 1: Hero --- */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 -mt-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div variants={itemVariants}>
            <img src={FarmBudLogo} alt="FarmBud Logo" className="w-64 mx-auto mb-4" />
          </motion.div>
          <motion.p className="mt-4 max-w-2xl text-lg text-gray-300" variants={itemVariants}>
            Your personal AI farming assistant. Get intelligent recommendations for crops, diseases, and soil to maximize your yield and secure your livelihood.
          </motion.p>
          <motion.div className="mt-8" variants={itemVariants}>
            <Button asChild size="lg" className="button-glow">
              <Link to="/disease-detect">Get Started</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* --- MODIFIED Section 2: The Problem --- */}
      <motion.section 
        className="py-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container mx-auto text-center">
          {/* --- NEW: Added a semi-transparent scrim for contrast --- */}
          <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl">
            <h2 className="text-4xl font-bold mb-4 text-slate-100">The Challenge Facing Small-Scale Farmers</h2>
            <p className="max-w-3xl mx-auto text-lg text-slate-300">
              Small-scale farmers are the backbone of our food supply, yet they face immense challenges daily. Unpredictable weather, devastating diseases, and a gap in access to modern technology create a cycle of uncertainty and financial instability.
            </p>
          </div>
        </div>
      </motion.section>

      {/* --- Section 3: Data Visualizations --- */}
      <motion.section 
        className="py-16"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <Card className="card-glow backdrop-blur-xl bg-card/60 border-border/20">
            <CardHeader>
              <CardTitle>Impact of Extreme Weather</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                Recent studies show 80% of marginal farmers suffer losses from climate events, with drought (41%) and irregular rain (32%) being the main causes.
              </p>
              <WeatherPieChart />
            </CardContent>
          </Card>
          
          <Card className="card-glow backdrop-blur-xl bg-card/60 border-border/20">
            <CardHeader>
              <CardTitle>Yield Loss from Diseases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                An estimated 15-25% of potential yield is consistently lost to preventable pests and diseases, impacting food security and farmer income.
              </p>
              <DiseaseBarChart />
            </CardContent>
          </Card>

          <Card className="card-glow backdrop-blur-xl bg-card/60 border-border/20">
            <CardHeader>
              <CardTitle>The Digital Divide</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">
                By 2025, over 65% of farmers are expected to use digital tools. FarmBud bridges this gap, providing crucial tech access to everyone.
              </p>
              <AccessBarChart />
            </CardContent>
          </Card>

        </div>
      </motion.section>
    </div>
  );
}