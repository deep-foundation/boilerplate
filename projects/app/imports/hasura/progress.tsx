import { LinearProgress } from "@material-ui/core";

export function GqlLinearProgress({
  result,
}: {
  result: {
    data?: any;
    loading: boolean;
    error?: any;
  };
}) {
  return <LinearProgress
    variant={result.loading ? 'indeterminate' : 'determinate'}
    color={result.error ? 'secondary' : 'primary'}
  />
}