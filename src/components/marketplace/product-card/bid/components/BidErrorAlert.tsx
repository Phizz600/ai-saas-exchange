
import { ErrorAlert } from './ErrorAlert';

interface BidErrorAlertProps {
  bidError: string | null;
}

export function BidErrorAlert({ bidError }: BidErrorAlertProps) {
  return <ErrorAlert error={bidError} type="bid" />;
}
