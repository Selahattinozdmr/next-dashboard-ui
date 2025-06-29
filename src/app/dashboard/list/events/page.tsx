import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getCurrentUserId, getRole } from "@/lib/role";
import { Event, Prisma } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type EventList = Event & { class: { name: string } | null };

const EventListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { page, ...qeryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // Get role and user ID
  const role = await getRole();
  const currentUserId = await getCurrentUserId();

  const columns = [
    {
      header: "Title",
      accessor: "title",
    },
    {
      header: "Class",
      accessor: "class",
    },
    {
      header: "Date",
      accessor: "startTime",
      className: "hidden md:table-cell",
    },
    {
      header: "Start Time",
      accessor: "startTime",
      className: "hidden md:table-cell",
    },
    {
      header: "End Time",
      accessor: "endTime",
      className: "hidden md:table-cell",
    },
    ...(role === "admin"
      ? [
          {
            header: "Actions",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: EventList) => (
    <tr
      key={item.id}
      className=" border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className=" flex items-center gap-4 p-4">{item?.title}</td>
      <td>{item.class?.name || "-"}</td>
      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("en-US").format(item.startTime)}
      </td>
      <td className="hidden md:table-cell">
        {item.startTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
      <td className="hidden md:table-cell">
        {item.endTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/events/${item.id}`}>
            <button className=" w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src={"/view.png"} alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormModal type="update" table="event" data={item} />
              <FormModal type="delete" table="event" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  // URL PARAMS CONDITIONS
  const query: Prisma.EventWhereInput = {};
  if (qeryParams) {
    for (const [key, value] of Object.entries(qeryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search": {
            query.title = {
              contains: value,
              mode: "insensitive",
            };
            break;
          }
          default:
            break;
        }
      }
    }
  }

  // ROLE CONDITIONS
  const roleConditions = {
    teacher: { lessons: { some: { teacherId: currentUserId! } } },
    student: { students: { some: { id: currentUserId! } } },
    parent: { students: { some: { parentId: currentUserId! } } },
  };

  query.OR = [
    { classId: null },
    { class: roleConditions[role as keyof typeof roleConditions] || {} },
  ];
  const [data, count] = await prisma.$transaction([
    prisma.event.findMany({
      where: query,
      include: {
        class: { select: { name: true } },
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.event.count({
      where: query,
    }),
  ]);

  return (
    <div className=" bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Events</h1>

        <div className=" flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src={"/filter.png"} width={14} height={14} alt="" />
            </button>

            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src={"/sort.png"} width={14} height={14} alt="" />
            </button>
            {role === "admin" && <FormModal type="create" table="event" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />
      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default EventListPage;
