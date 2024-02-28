"use client"

import { Button } from "@/components/ui/button"
import { sendMessage } from "@/lib/actions/send-message"
import { delay } from "@/lib/utils"
import { SendHorizonal } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { useState } from "react"
import FluidSpinner from "./loader/fluid"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { useToast } from "./ui/use-toast"

export default function MessageForm({ roomId }: { roomId: string }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const { execute, result, status, reset } = useAction(sendMessage, {
    onSuccess: ({ success }) => {
      // success &&
      //   toast({
      //     variant: "default",
      //     title: "Success!",
      //     className: "bg-success text-success-foreground",
      //     description: `${success.message}`,
      //   })
      setIsLoading(false)
    },
    onError: ({ validationErrors, serverError }) => {
      validationErrors &&
        toast({
          variant: "destructive",
          title: "Oops!",
          description: validationErrors.text,
          className: "bg-destructive text-destructive-foreground",
        })
      serverError &&
        toast({
          variant: "destructive",
          title: "Oops!",
          description: serverError,
          className: "bg-destructive text-destructive-foreground",
        })
      setIsLoading(false)
    },
  })

  return (
    <Card className="flex w-full max-w-2xl gap-2 p-6">
      <form
        action={async (values) => {
          await delay(1000)
          execute(values)
        }}
        className="flex w-full items-center gap-2"
      >
        <Input
          onChange={(e) => e.target.value}
          type="text"
          name="text"
          placeholder="Type a message here"
          className="bg-background placeholder:opacity-70"
        />
        <input type="text" name="roomId" defaultValue={roomId} />

        <Button
          type="submit"
          variant="secondary"
          disabled={status === "executing"}
          className="w-24"
          onClick={() => setIsLoading(true)}
          spellCheck={false}
        >
          {isLoading ? (
            <FluidSpinner />
          ) : (
            <div className="flex items-center justify-center gap-2">
              Send <SendHorizonal size={16} />
            </div>
          )}
        </Button>
      </form>
    </Card>
  )
}
