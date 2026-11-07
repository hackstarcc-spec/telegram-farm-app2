"use client";

import { TaskRow } from "@/components/tasks/TaskRow";

const stubs = [
  {
    id: "1",
    title: "Ежедневный вход",
    description: "Зайди в Mini App сегодня",
    rewardCoins: "50",
    status: "available",
  },
  {
    id: "2",
    title: "Подписка на канал",
    description: "Подпишись на @coinbarn",
    rewardCoins: "250",
    status: "available",
  },
  {
    id: "3",
    title: "Пригласи 3 друзей",
    description: "Поделись реферальной ссылкой",
    rewardCoins: "500",
    status: "available",
  },
];

export default function TasksPage() {
  return (
    <main className="animate-rise">
      <h1 className="font-display text-3xl font-bold text-barn-hay">Задания</h1>
      <p className="mt-1 text-sm text-barn-cream/70">Ежедневные и подписка</p>
      <div className="mt-4">
        {stubs.map((t) => (
          <TaskRow key={t.id} {...t} />
        ))}
      </div>
    </main>
  );
}
