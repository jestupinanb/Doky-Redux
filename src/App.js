import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Route, Redirect, Switch, useRouteMatch } from 'react-router-dom'
import Landingpage from './continers/landingpage/Landingpage';
import { LandingUpperBar } from './components/landingUpperBar/landingUpperBar';
import { LoginPage } from './continers/loginPage/loginPage';
import RegisterPage from './continers/register/register';
import fire from './database/config/Fire'
import { fetchUsers } from './store/actions/user';
import ConsumerNavbar from './components/consumerNavbar/consumerNavbar';
import HomeConsumer from './continers/consumer/home/HomeConsumer';
import PaseosPage from './continers/paseos/paseos_page';
import PaseosVisualizar from './continers/paseos/paseos_visualizar';
import GuarderiasVisualizar from './continers/guarderia/guarderia_visualizar';
import GuarderiasPage from './continers/guarderia/guarderia_page';
import { LINK_GUARDERIAS, LINK_PASEOS, LINK_VETERINARIAS, LINK_SALTOS, LINK_PERFIL, LINK_MASCOTAS, LINK_REGISTRO_MASCOTAS, LINK_MIS_SERVICIOS, LINK_ABOUT, LINK_INGRESAR, LINK_REGISTRARSE } from './links';
import VeterinariasPage from './continers/veterinarias/veterinarias_page';
import VeterinariasVisualizar from './continers/veterinarias/veterinarias_visualizar';
import SaltosPage from './continers/saltos/saltos_page';
import SaltosVisualizar from './continers/saltos/salto_visualizar';
import Perfil from './continers/PerfilConsumidor/perfil';
import Mascotas from './continers/Mascotas/ver_mascotas/mascotas';
import RegistroMascotas from './continers/Mascotas/registro_mascotas/RegistroMascotas';
import ServicesContainer from './continers/Mis_Servicios/services_container/ServicesContainer';
import NotFound from './continers/notFound/notFound';
import LoginNavbar from './continers/loginPage/LoginNavbar';

const HomeRoute = ({ component: Component, children, ...rest }) => {
  const user = useSelector(state => state.user.user)
  return (
    <Route
      {...rest}
      render={
        props => {
          console.log("rest")
          console.log(rest)
          if (user === null) {
            return <Component {...props} />
          } else {
            return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
          }
        }
      }
    />
  )
}


function App() {
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch();

  const NotFoundUrl = <NotFound />

  useEffect(
    () => {
      const onAuthStateChanged = async () => {
        fire.auth().onAuthStateChanged(
          user => {
            dispatch(fetchUsers(user))
          }
        );
      }
      onAuthStateChanged()
    }, [dispatch]
  )

  const matchAbout = useRouteMatch(LINK_ABOUT);
  const matchLogin = useRouteMatch(LINK_INGRESAR);

  if (matchAbout) {
    return <Route path={LINK_ABOUT}><div>¡Ey! Estamos desarrollando la pagina de about!</div> </Route>
  }

  if (matchLogin) {
    return (
      <>
        <Route path="/"> <LoginNavbar /> </Route>
        <div style={{ marginTop: "66px" }} ></div>
        <Route path={LINK_INGRESAR}> <LoginPage /> </Route>
      </>
    )
  }

  switch (user && user.tipo) {
    case 'Consumidor':
      return (
        <>
          <Route path='/'> <ConsumerNavbar /> </Route>
          <div style={{ marginTop: "66px" }} ></div>
          <Switch>
            <Route exact path='/'> <HomeConsumer /> </Route>
            <Route exact path={LINK_PASEOS}> <PaseosPage /> </Route>
            <Route exact path='/paseos/:id'> <PaseosVisualizar /> </Route>
            <Route exact path={LINK_GUARDERIAS}> <GuarderiasPage /> </Route>
            <Route exact path={LINK_GUARDERIAS + "/:id"}> <GuarderiasVisualizar /> </Route>
            <Route exact path={LINK_VETERINARIAS}> <VeterinariasPage /> </Route>
            <Route exact path={LINK_VETERINARIAS + "/:id"}> <VeterinariasVisualizar /> </Route>
            <Route exact path={LINK_SALTOS}> <SaltosPage /> </Route>
            <Route exact path={LINK_SALTOS + "/:id"}> <SaltosVisualizar /> </Route>
            <Route exact path={LINK_PERFIL}> <Perfil /> </Route>
            <Route exact path={LINK_MASCOTAS}> <Mascotas /> </Route>
            <Route exact path={LINK_REGISTRO_MASCOTAS}> <RegistroMascotas /> </Route>
            <Route exact path={LINK_MIS_SERVICIOS}> <ServicesContainer /> </Route>
            <Route> {NotFoundUrl} </Route>
          </Switch>
        </>
      )
    case 'Prestador':
      return <Route>{NotFoundUrl}</Route>
    default:
      return (
        <>
          <Route path='/'> <LandingUpperBar /> </Route>
          <div style={{ marginTop: "66px" }} ></div>
          <Switch>
            <Route exact path='/'> <Landingpage /> </Route>
            <Route exact path={LINK_REGISTRARSE}> <RegisterPage /> </Route>
            
            <Route> {NotFoundUrl} </Route>
          </Switch>
        </>
      )
  }
}

export default App;
