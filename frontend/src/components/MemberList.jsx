import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Crown, Users } from "lucide-react";
import InviteModal from "./InviteModal";
import { timeAgo } from "@/utils/timeAgo";

const MemberList = ({ member = [], invites = [], onInvite }) => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      {/* Invite Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setOpenModal(true)}
          className="flex gap-1 items-center text-sm rounded-3xl bg-blue-500 text-white px-4 py-2 hover:shadow"
        >
          Invite Member
        </button>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Tabs Header */}
          <div className="border-b px-4 h-12 flex items-center">
            <TabsList className="bg-transparent p-0 h-12">
              <TabsTrigger
                value="members"
                className="focus:outline-none focus:ring-0 focus-visible:ring-0"
              >
                Members ({member.length})
              </TabsTrigger>

              <TabsTrigger
                value="invites"
                className="focus:outline-none focus:ring-0 focus-visible:ring-0"
              >
                Invites ({invites.length})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* MEMBERS TABLE */}
          <TabsContent value="members" className="m-0">
            <Table>
              <TableHeader className="h-12">
                <TableRow>
                  <TableHead className="text-xs text-gray-500 uppercase">
                    User
                  </TableHead>
                  <TableHead className="text-xs text-gray-500 uppercase">
                    Email
                  </TableHead>
                  <TableHead className="text-xs text-gray-500 uppercase">
                    Joined
                  </TableHead>
                  <TableHead className="text-xs text-gray-500 uppercase">
                    Role
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {member.map((m) => (
                  <TableRow
                    key={m.userId}
                    className="hover:bg-gray-50 transition"
                  >
                    <TableCell className="flex items-center gap-3 py-4 h-12">
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium overflow-hidden">
                        {m.imageUrl ?
                          <img
                            src={m.imageUrl}
                            alt={m.name}
                            className="w-full h-full object-cover"
                          />
                        : m.name?.[0]?.toUpperCase()}
                      </div>
                      {m.name}
                    </TableCell>

                    <TableCell className="py-4">{m.email}</TableCell>

                    <TableCell className="py-4 text-gray-500 text-sm">
                      {timeAgo(m.createdAt)}
                    </TableCell>

                    <TableCell className="py-4">
                      {m.role === "admin" ?
                        <span className="flex items-center gap-1 text-yellow-600 text-sm">
                          <Crown size={14} /> Admin
                        </span>
                      : <span className="flex items-center gap-1 text-green-600 text-sm">
                          <Users size={14} /> Member
                        </span>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          {/* INVITES TABLE */}
          <TabsContent value="invites" className="m-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs text-gray-500 uppercase">
                    Email
                  </TableHead>
                  <TableHead className="text-xs text-gray-500 uppercase">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {invites.map((inv) => (
                  <TableRow
                    key={inv._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <TableCell className="py-4">{inv.email}</TableCell>

                    <TableCell className="py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          inv.status === "pending" ?
                            "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </div>
      </Tabs>

      {openModal && (
        <InviteModal
          onClose={() => setOpenModal(false)}
          onCreate={onInvite}
          title="Invite Member"
          placeholder="johndoe@gmail.com"
          buttonText="Send Invite"
        />
      )}
    </>
  );
};

export default MemberList;
