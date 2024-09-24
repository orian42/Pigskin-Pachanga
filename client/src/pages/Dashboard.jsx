import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Auth from '../utils/auth';
import '../styles/Dashboard.css'
import TeamsList from '../components/MyTeams'
import AddTeam from '../components/AddTeam'
import LeaguesList from '../components/MyLeagues';
import AddLeague from '../components/AddLeague';

import { QUERY_TEAMS_BY_OWNER, QUERY_LEAGUES_BY_COMM } from '../utils/queries';

export default function Dashboard() {
  const loggedIn = Auth.loggedIn();
  const userId = loggedIn ? Auth.getProfile().data?._id : "";
  const userName = loggedIn ? Auth.getProfile().data?.name : "";
  const email = loggedIn ? Auth.getProfile().data?.email : "";

  const [addingTeam, setAddingTeam] = useState(false);
  const [addingLeague, setAddingLeague] = useState(false);

  // If there is no `profileId` in the URL as a parameter, execute the `QUERY_ME` query instead for the logged in user's information
  const { loading, data } = useQuery(QUERY_TEAMS_BY_OWNER, {
    variables: { ownerId: userId },
    skip: !userId,
  });
  const { loading: leagueLoading, data: leagueData } = useQuery(QUERY_LEAGUES_BY_COMM, {
    variables: { commId: userId },
    skip: !userId,
  });

  const teams = data?.teamsByOwner || [];
  const leagues = leagueData?.leaguesByComm || [];

  const handleRenderForm = () => {
    setAddingTeam(true);
  }
  const handleRenderLeagueForm = () => {
    setAddingLeague(true);
  }

  return (
    <div className="dashboard-wrapper">
      <h2>DASHBOARD</h2>
      
      {loggedIn ? (
        <div className="dashboard-content">

          <div className="center-section">

            <div>
              <h3>My Teams</h3>
              <div>
                {addingTeam ? (
                  <AddTeam />
                ) : (
                  <div>
                    <button onClick={handleRenderForm}>Add New Team</button>
                    {loading ? (
                      <p>Loading teams...</p>
                    ) : (
                      <TeamsList teams={teams || []} isLoggedInUser={true} />
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="container">
              
              <p>Username: {userName}</p>
              <p>Email: {email}</p>
            </div>

          </div>

          <div className='right-section'>

            <div>
              <h3>My Leagues</h3>
              <div>
                {addingLeague ? (
                  <AddLeague userId={userId} />
                ) : (
                  <div>
                    <button
                      className="btn btn-primary m-3"
                      onClick={handleRenderLeagueForm}
                    >Add New League</button>
                    {leagueLoading ? (
                      <p>Loading leagues...</p>
                    ) : (
                      <LeaguesList
                        leagues={leagues || []}
                        isLoggedInUser={true}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      ) : (
        <p>Please log in or sign up!</p>
      )}
    </div>
  );
}