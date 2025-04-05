import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">About Our Classroom</h1>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              We are dedicated to providing a dynamic and inclusive learning
              environment that fosters academic excellence, critical thinking,
              and personal growth. Our mission is to empower students with the
              knowledge, skills, and values they need to succeed in an
              ever-changing world.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-600 mb-6">
              To be a leading educational institution that inspires lifelong
              learning, innovation, and community engagement. We strive to
              create an environment where every student can discover their
              potential and develop into well-rounded individuals.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-500">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium">Excellence</h3>
                  <p className="text-gray-600">
                    Striving for the highest standards in education and personal
                    achievement
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-500">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium">Innovation</h3>
                  <p className="text-gray-600">
                    Embracing new ideas and approaches to learning and teaching
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-blue-500">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium">Inclusivity</h3>
                  <p className="text-gray-600">
                    Creating a welcoming environment that celebrates diversity
                    and promotes equality
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Our Approach</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-600">
              We believe in a holistic approach to education that combines
              traditional teaching methods with modern technology and innovative
              learning techniques. Our experienced faculty members are committed
              to providing personalized attention and support to help each
              student reach their full potential.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
