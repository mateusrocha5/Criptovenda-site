import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/context/WalletContext";
import { insertUserSchema } from "@shared/schema";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { z } from "zod";

type PersonalInfoFormValues = z.infer<typeof insertUserSchema>;

const KYCSection = () => {
  const [formStep, setFormStep] = useState(1);
  const { toast } = useToast();
  const { connected, walletAddress, walletType } = useWallet();

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      cpf: "",
      birthDate: "",
      phone: "",
      address: ""
    },
  });

  const onSubmit = async (data: PersonalInfoFormValues) => {
    if (!connected || !walletAddress) {
      toast({
        title: "Conecte sua carteira",
        description: "É necessário conectar uma carteira antes de prosseguir com o KYC.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Informações recebidas",
      description: "Você avançou para o próximo passo de verificação KYC.",
    });
    setFormStep(2);
    console.log({
      ...data,
      walletAddress,
      walletType
    });
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    form.setValue("cpf", formatted);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = e.target.value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1)$2")
      .replace(/(\d{5})(\d)/, "$1-$2");
      form.setValue("phone", formatted);

  };


  return (
    <section id="kyc" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Verificação KYC</h2>
        <p className="text-center text-medium max-w-3xl mx-auto mb-12">
          Complete o processo de verificação de identidade para garantir a segurança das suas transações e cumprir com as regulamentações locais.
        </p>

        <div className="max-w-4xl mx-auto bg-light rounded-xl p-6 shadow-md">
          <div className="flex flex-wrap mb-8">
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <div className={`${formStep >= 1 ? "step-active border-primary bg-blue-50" : "border-gray-200"} border-2 rounded-lg p-4 h-full flex flex-col items-center text-center`}>
                <span className={`material-icons ${formStep >= 1 ? "text-primary" : "text-gray-400"} text-2xl mb-2`}>
                  account_circle
                </span>
                <h4 className="font-bold mb-1">Informações Pessoais</h4>
                <p className="text-sm text-medium">Dados básicos para identificação</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <div className={`${formStep >= 2 ? "step-active border-primary bg-blue-50" : "border-gray-200"} border-2 rounded-lg p-4 h-full flex flex-col items-center text-center`}>
                <span className={`material-icons ${formStep >= 2 ? "text-primary" : "text-gray-400"} text-2xl mb-2`}>
                  contact_mail
                </span>
                <h4 className="font-bold mb-1">Documentação</h4>
                <p className="text-sm text-medium">Envio de documentos para verificação</p>
              </div>
            </div>
            <div className="w-full md:w-1/3 px-2">
              <div className={`${formStep >= 3 ? "step-active border-primary bg-blue-50" : "border-gray-200"} border-2 rounded-lg p-4 h-full flex flex-col items-center text-center`}>
                <span className={`material-icons ${formStep >= 3 ? "text-primary" : "text-gray-400"} text-2xl mb-2`}>
                  check_circle
                </span>
                <h4 className="font-bold mb-1">Confirmação</h4>
                <p className="text-sm text-medium">Aprovação e liberação de conta</p>
              </div>
            </div>
          </div>

          <div className="kyc-form bg-white p-6 rounded-lg border border-gray-200">
            {formStep === 1 && (
              <>
                <h3 className="font-bold text-xl mb-6">Informações Pessoais</h3>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="000.000.000-00"
                                onChange={handleCPFChange}
                                maxLength={14}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Nascimento</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="(00) 00000-0000"
                                onChange={handlePhoneChange}
                                maxLength={15}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço Completo</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        className="w-full md:w-auto float-right"
                      >
                        Próximo Passo <span className="material-icons align-middle ml-1 text-sm">arrow_forward</span>
                      </Button>
                    </div>
                  </form>
                </Form>
              </>
            )}

            {formStep === 2 && (
              <>
                <h3 className="font-bold text-xl mb-6">Upload de Documentos</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RG ou CNH (frente)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <span className="material-icons text-gray-400 text-4xl mb-2">
                        cloud_upload
                      </span>
                      <p className="text-sm text-gray-500 mb-2">
                        Arraste e solte seu documento aqui, ou
                      </p>
                      <Button variant="outline">Selecionar Arquivo</Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      RG ou CNH (verso)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <span className="material-icons text-gray-400 text-4xl mb-2">
                        cloud_upload
                      </span>
                      <p className="text-sm text-gray-500 mb-2">
                        Arraste e solte seu documento aqui, ou
                      </p>
                      <Button variant="outline">Selecionar Arquivo</Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Selfie com documento
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <span className="material-icons text-gray-400 text-4xl mb-2">
                        cloud_upload
                      </span>
                      <p className="text-sm text-gray-500 mb-2">
                        Arraste e solte sua foto aqui, ou
                      </p>
                      <Button variant="outline">Selecionar Arquivo</Button>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormStep(1)}
                    >
                      <span className="material-icons align-middle mr-1 text-sm">arrow_back</span> Voltar
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        setFormStep(3);
                        toast({
                          title: "Documentos enviados",
                          description: "Seus documentos foram enviados para análise.",
                        });
                      }}
                    >
                      Enviar Documentos <span className="material-icons align-middle ml-1 text-sm">arrow_forward</span>
                    </Button>
                  </div>
                </div>
              </>
            )}

            {formStep === 3 && (
              <div className="text-center py-8">
                <div className="flex justify-center mb-6">
                  <span className="material-icons text-green-500 text-6xl">check_circle</span>
                </div>
                <h3 className="font-bold text-2xl mb-4">Documentos Enviados!</h3>
                <p className="text-medium mb-8">
                  Seus documentos foram recebidos e estão em análise. Você receberá uma notificação por email quando a verificação for concluída.
                </p>
                <p className="text-medium mb-4">
                  Tempo estimado para análise: <span className="font-bold">24-48 horas</span>
                </p>
                <Button type="button" variant="outline" className="mt-4">
                  Voltar para a página inicial
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KYCSection;