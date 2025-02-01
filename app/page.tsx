import Wrapper from './components/Wrapper';


export default function Home() {
  
  return (
    <Wrapper>
      <div className="hero flex h-screen flex-col items-center justify-start bg-slate-50 mt-4 text-center rounded-xl">
        <h1 className="text-3xl font-bold mt-6 text-slate-800 text-pretty">Home</h1>
        <p className="text-xl">Welcome to the home page</p>
      </div>
    </Wrapper>
  );
}
