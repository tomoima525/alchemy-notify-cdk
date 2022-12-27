import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AppRunner } from "./apprunner-stack";

export class AlchemyNotifyCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new AppRunner(this, "AppRunner");
  }
}
