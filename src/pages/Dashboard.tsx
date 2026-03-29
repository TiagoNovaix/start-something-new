const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card rounded-lg border shadow-subtle">
          <h3 className="text-sm font-medium text-secondary">Receita Total</h3>
          <p className="text-3xl font-serif mt-2">R$ 125.430,00</p>
        </div>
        <div className="p-6 bg-card rounded-lg border shadow-subtle">
          <h3 className="text-sm font-medium text-secondary">Despesas</h3>
          <p className="text-3xl font-serif mt-2 text-negative">R$ 42.180,00</p>
        </div>
        <div className="p-6 bg-card rounded-lg border shadow-subtle">
          <h3 className="text-sm font-medium text-secondary">Lucro Líquido</h3>
          <p className="text-3xl font-serif mt-2 text-positive">R$ 83.250,00</p>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-subtle p-6 h-[400px] flex items-center justify-center">
        <p className="text-secondary">Em construção</p>
      </div>
    </div>
  );
};

export default Dashboard;