
interface LoginParams {
  params: {
    user: string;
  };
}
const login = ({ params }: LoginParams) => {
  return <div>lid {params.user}
  </div>;
};

export default login;
