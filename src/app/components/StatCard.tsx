import { Card, CardContent } from "./Card";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
    >
      <Card className="rounded-2xl shadow-lg">
        <CardContent className="p-6">
          <h4 className="text-gray-500 text-sm font-medium mb-2">{title}</h4>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
