// src/components/HomeContents/HomeContentsSkeleton.tsx
import { Box, Card, Grid, Skeleton } from '@mui/material'

/**
 * ローディング中のスケルトンコンポーネント
 * @returns
 */
const HomeContentsSkeleton = () => (
  <Grid container spacing={2}>
    {Array.from({ length: 6 }).map((_, i) => (
      <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
        <Card>
          <Skeleton variant="rectangular" height={140} />
          <Box p={2}>
            <Skeleton width="60%" />
            <Skeleton width="80%" />
          </Box>
          <Box p={2} pt={0}>
            <Skeleton width="40%" />
          </Box>
        </Card>
      </Grid>
    ))}
  </Grid>
)

export default HomeContentsSkeleton
