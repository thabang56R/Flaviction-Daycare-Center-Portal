// src/components/common/Badge.js
import React from 'react';
import { Badge, Tooltip } from '@chakra-ui/react';
import Confetti from 'react-confetti'; // Install react-confetti

const AchievementBadge = ({ label }) => {
  const [showConfetti, setShowConfetti] = React.useState(true);
  React.useEffect(() => { setTimeout(() => setShowConfetti(false), 3000); }, []);

  return (
    <Tooltip label={label}>
      <Badge colorScheme="green" variant="solid" fontSize="lg" px={3} py={1} borderRadius="full">
        🏆 {label}
        {showConfetti && <Confetti width={200} height={200} />}
      </Badge>
    </Tooltip>
  );
};

export default AchievementBadge;