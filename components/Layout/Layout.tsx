import Wrapper from '../Wrapper/Wrapper';

function Layout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <Wrapper>{children}</Wrapper>
      </>
   );
}

export default Layout;
