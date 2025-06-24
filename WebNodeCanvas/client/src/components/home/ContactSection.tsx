import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
  subject: z.string().min(3, { message: "Assunto deve ter pelo menos 3 caracteres." }),
  message: z.string().min(10, { message: "Mensagem deve ter pelo menos 10 caracteres." }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    toast({
      title: "Mensagem enviada",
      description: "Entraremos em contato em breve.",
    });
    form.reset();
    console.log(data);
  };

  return (
    <section id="contact" className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Entre em Contato</h2>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-primary p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Informações de Contato</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="material-icons mr-3">phone</span>
                  <span>+55 (11) 97382-9459</span>
                </div>
                <div className="flex items-start">
                  <span className="material-icons mr-3">whatsapp</span>
                  <a href="https://wa.me/5511973829459" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                    +55 (11) 97382-9459
                  </a>
                </div>
                <div className="flex items-start">
                  <span className="material-icons mr-3">telegram</span>
                  <a href="https://t.me/+ypTkYhxwg3ZkMGIx" target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                    Entrar no Grupo do Telegram
                  </a>
                </div>
                <div className="flex items-start">
                  <span className="material-icons mr-3">email</span>
                  <span>mateusrocha5653@gmail.com</span>
                </div>
                <div className="flex items-start">
                  <span className="material-icons mr-3">location_on</span>
                  <span>Av. Paulista, 1000 - São Paulo, SP</span>
                </div>
              </div>
              <div className="mt-12">
                <h4 className="font-bold mb-4">Siga nossas redes sociais</h4>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-accent">
                    <span className="material-icons">facebook</span>
                  </a>
                  <a href="#" className="hover:text-accent">
                    <span className="material-icons">telegram</span>
                  </a>
                  <a href="#" className="hover:text-accent">
                    <span className="material-icons">discord</span>
                  </a>
                  <a href="#" className="hover:text-accent">
                    <span className="material-icons">language</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-8">
              <h3 className="text-2xl font-bold mb-6">Envie sua mensagem</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assunto</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="pt-4">
                    <Button type="submit" className="w-full">
                      Enviar Mensagem
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;