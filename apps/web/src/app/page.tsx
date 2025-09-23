"use client";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";

export default function Index() {
  const data  = useQuery(trpc.getUserById.queryOptions("1"));
  console.log(data);
  return (
    <div>
      <h1>Hello World</h1>
      <p>{data?.data?.name}</p>
    </div>
  );
}
