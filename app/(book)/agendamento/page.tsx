import BookForm from "@/components/Agendamento/bookForm";
import { auth } from "@/auth";
import { getServices } from "@/lib/actions/service";

const Agendamento = async () => {
  const session = await auth();
  const isAdmin = session?.user.role === 'ADMIN';
  const services = await getServices();

  return (
    <main>
      <BookForm isAdmin={isAdmin} services={services.data ?? []}/>
    </main>
  )
}

export default Agendamento
