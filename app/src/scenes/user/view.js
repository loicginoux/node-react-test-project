import React, { useEffect, useState } from "react";
import Loader from "../../components/loader";
import api from "../../services/api";
import { useHistory, useParams } from "react-router-dom";

export default () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    (async () => {
      const response = await api.get(`/user/${id}`);
      setUser(response.data);
    })();
  }, []);

  if (!user) return <Loader />;

  return (
    <div>
      <div className="appContainer pt-24">
        <Detail user={user} />
      </div>
    </div>
  );
};

const Detail = ({ user }) => {
  const history = useHistory();

  return (
    <React.Fragment>
      <div className="pl-20 pt-24 pb-4 w-[98%]">
        <div className="bg-[#FFFFFF] border border-[#E5EAEF] py-3 rounded-[16px]">
          <div className="flex justify-between px-3 pb-2  border-b border-[#E5EAEF]">
            <div>
              <span className="text-[18px] text-[#212325] font-semibold">User details</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => history.push(`/user/edit/${user?._id}`)}
                className="border !border-[#0560FD] text-[#0560FD] py-[7px] px-[20px] bg-[#FFFFFF] rounded-[16px]">
                Edit
              </button>
            </div>
          </div>
          <UserMonthActivity user={user}/>
        </div>
      </div>
    </React.Fragment>
  );
};

const UserMonthActivity = ({ user }) => {
  const [projectActivities, setProjectActivities] = useState([]);

  useEffect(() => {
    (async () => {
      let date = new Date();
      const dateFrom = new Date(date.getFullYear(), date.getMonth(), 1)
      const dateTo = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      const { data } = await api.get(`/activity?dateFrom=${dateFrom.getTime()}&dateTo=${dateTo.getTime()}&userId=${encodeURIComponent(user._id)}`);
      if (data.length == 0) return;
      const projects = await api.get(`/project/list`);
      setProjectActivities(projectAggregatedInfos(data, projects.data, user))
    })();
  }, []);

  return (
    <div>
      <div className="flex flex-wrap p-3">
        <div className="w-full ">
          <div className="flex gap-3">
            <div className="w-full">
              <div className="flex justify-between gap-2">
                <div className="flex gap-20">
                  <span className="w-fit text-[20px] text-[#0C1024] font-bold">Activity this month</span>
                </div>
              </div>
              <div className="w-full md:w-[50%]">
                <div className="pt-2 ">
                  <span className="text-[16px] text-[#676D7C] font-bold">Name: {user.name.toString()}</span>
                </div>
                <div className="pt-2 ">
                  <span className="text-[16px] text-[#676D7C] font-medium">Cost per day: {user.costPerDay ? user.costPerDay : ""}€</span>
                </div>
                <div className="pt-2 ">
                  <span className="text-[16px] text-[#676D7C] font-medium">Sell per day: {user.sellPerDay ? user.sellPerDay : ""}€</span>
                </div>
                <div className="pt-6 ">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                              <th scope="col" className="px-6 py-3">
                                  Project
                              </th>
                              <th scope="col" className="px-6 py-3">
                                  Days worked
                              </th>
                              <th scope="col" className="px-6 py-3">
                                  Cost
                              </th>
                              <th scope="col" className="px-6 py-3">
                                  Billed
                              </th>
                          </tr>
                      </thead>
                      <tbody>
                          {projectActivities.map((project, i) => (
                            <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <th
                                  scope="row"
                                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                  {project.projectName}
                                </th>
                                <td className="px-6 py-4">{project.daysWorked}</td>
                                <td className="px-6 py-4">{project.cost}€</td>
                                <td className="px-6 py-4">{project.billed}€</td>
                            </tr>
                          ))}
                          <tr className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                              <th scope="col" className="px-6 py-3">
                                  Total
                              </th>
                              <th scope="col" className="px-6 py-3">
                                  {projectActivities.reduce((acc, b) => acc + b.daysWorked, 0)}
                              </th>
                              <th scope="col" className="px-6 py-3">
                                  {projectActivities.reduce((acc, b) => acc + b.cost, 0)}€
                              </th>
                              <th scope="col" className="px-6 py-3">
                                  {projectActivities.reduce((acc, b) => acc + b.billed, 0)}€
                              </th>
                          </tr>
                      </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap p-3 gap-4"></div>
    </div>
  );
};


const projectAggregatedInfos = (activities, projects, user) => {
  const hoursPerDay = 8;

  return projects.map((project) => {
    const projectwithActivity = activities.find((activity) => activity.projectId === project._id);
    if (!projectwithActivity) return;
    const hoursWorked = projectwithActivity.detail.reduce((acc, b) => acc + b.value, 0)
    const daysWorked = hoursWorked / hoursPerDay;
    return {
      projectName: project.name,
      daysWorked: daysWorked,
      cost: daysWorked * user.costPerDay,
      billed: daysWorked * user.sellPerDay,
    }
  }).filter(n => n)
}