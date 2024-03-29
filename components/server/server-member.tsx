"use client"

import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { ShieldAlert, ShieldCheck, User } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import UserAvatar from "@/components/user-avatar"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"

interface ServerMemberProps {
  member: Member & { profile: Profile }
  server: Server
}

const roleIconMap = {
  [MemberRole.GUEST]: (
    <User className="ml-auto hidden size-3 fill-primary/30 hover:text-primary group-hover:block" />
  ),
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-auto hidden size-3 fill-primary/30 hover:text-primary group-hover:block" />
  ),
  [MemberRole.ADMIN]: (
    <ShieldAlert className="ml-auto hidden size-3 fill-primary/30 hover:text-primary group-hover:block" />
  ),
}

export const ServerMember = ({ member }: ServerMemberProps) => {
  const params = useParams()
  const router = useRouter()

  const icon = roleIconMap[member.role]

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="sm"
      className={cn(
        "group my-1 flex w-full items-center justify-start gap-x-2 rounded-md p-2 text-card-foreground/70 transition hover:bg-secondary/10 hover:text-secondary/80",
        params?.memberId === member.id && "bg-secondary/20 text-secondary/90",
      )}
    >
      <UserAvatar src={member.profile.imageUrl} className="size-5" />
      <p className="text-[13px] font-medium opacity-90">
        {member.profile.name}
      </p>
      {icon}
    </Button>
  )
}
