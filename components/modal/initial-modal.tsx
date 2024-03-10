"use client"

import FileUpload from "@/components/file-upload"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  name: z.string().min(1, { message: "Server name is required" }),
  imageUrl: z.string().min(1, { message: "Server image is required" }),
})

export default function InitialModal() {
  const router = useRouter()
  // Create a form instance with zod resolver 🧪
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  })
  // Lets extract the Loading state from the schema!
  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/servers", values)
      form.reset()
      router.refresh()
      window.location.reload()
    } catch (error) {
      console.error("[INITIAL_MODAL]", error)
      throw new Error("Something went wrong while creating your server")
    }
  }
  return (
    <Dialog open>
      <DialogContent className="overflow-hidden bg-card p-0 text-card-foreground">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center">
            Give your server a name and upload an image to get started! You can
            always change this image later under the server settings.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          {/* Pass a native form element using the form state we spread above from useForm 🚀 */}
          {/* Additionally we can pass our onSubmit handler to the form component! */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="border-0 bg-muted focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter a server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-muted/40 px-6 py-4">
              <Button type="submit" disabled={isLoading} variant="default">
                {isLoading ? "Creating..." : "Create Server"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
