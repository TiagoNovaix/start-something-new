import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoriasDre from "@/components/configuracoes/CategoriasDre";
import ContasBancarias from "@/components/configuracoes/ContasBancarias";
import EmpresaConfig from "@/components/configuracoes/EmpresaConfig";
import Recurrencias from "@/components/configuracoes/Recurrencias";

const Configuracoes = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Configurações</h1>
      <Tabs defaultValue="categorias" className="w-full">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="categorias">Categorias DRE</TabsTrigger>
          <TabsTrigger value="contas">Contas Bancárias</TabsTrigger>
          <TabsTrigger value="empresa">Empresa</TabsTrigger>
        </TabsList>
        <TabsContent value="categorias">
          <CategoriasDre />
        </TabsContent>
        <TabsContent value="contas">
          <ContasBancarias />
        </TabsContent>
        <TabsContent value="empresa">
          <EmpresaConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Configuracoes;
