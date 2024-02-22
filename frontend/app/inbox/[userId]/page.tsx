"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const Page: React.FC = () => {
  const { userId } = useParams();
  if (!userId) return <div>loading...</div>;
  return <div>inbox</div>;
};

export default Page;
