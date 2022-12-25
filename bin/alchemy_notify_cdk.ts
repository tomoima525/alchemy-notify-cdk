#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { AlchemyNotifyCdkStack } from '../lib/alchemy_notify_cdk-stack';

const app = new cdk.App();
new AlchemyNotifyCdkStack(app, 'AlchemyNotifyCdkStack');
