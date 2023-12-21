"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const { userId } = useParams();
  if (!userId) return <div>loading...</div>;
  return <div>{userId}</div>;
};

export default page;
