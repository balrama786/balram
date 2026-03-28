"use client";

import FlowCanvas from '@/src/components/botFlow/Flow';
import { ReactFlowProvider } from '@xyflow/react';

const BuilderPage = () => {
  return (
    <ReactFlowProvider>
      <FlowCanvas />
    </ReactFlowProvider>
  );
}

export default BuilderPage;
