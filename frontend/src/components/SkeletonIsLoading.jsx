import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";

function SkeletonIsLoading({ isLoading }) {
  return (
    <Box w="full" h="100%" padding="6" boxShadow="lg" bg="teal.200">
      <SkeletonCircle
        isLoaded={!isLoading}
        startColor="teal.100"
        endColor="teal.300"
        size="10"
      />
      <SkeletonText
        isLoaded={!isLoading}
        startColor="teal.100"
        endColor="teal.300"
        mt="6"
        noOfLines={4}
        spacing="6"
        skeletonHeight="3"
      />
    </Box>
  );
}

export default SkeletonIsLoading;
