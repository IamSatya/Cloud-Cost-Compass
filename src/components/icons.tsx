import type { ComponentType } from "react";
import {
  Server,
  Archive,
  FunctionSquare,
  Database,
  Cloud,
  Network,
  Activity,
  Shield,
  MessageSquare,
} from "lucide-react";

export const SERVICE_ICONS: { [key: string]: ComponentType<{ className?: string }> } = {
  EC2: Server,
  S3: Archive,
  Lambda: FunctionSquare,
  RDS: Database,
  VPC: Network,
  CloudWatch: Activity,
  IAM: Shield,
  SQS: MessageSquare,
  Other: Cloud,
};
