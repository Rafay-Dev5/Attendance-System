import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Grid } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import moment from "moment";

//const uri = "https://localhost:44356";
const columns = [
  //{ field: "id", headerName: "ID", width: 90 },
  {
    field: "std_name",
    headerName: "Name",
    width: 250,
  },
  {
    field: "date",
    headerName: "Date",
    width: 150,
  },
  {
    field: "attendance1",
    headerName: "P/A",
    width: 20,
    editable: true,
  },
];

const AttendanceTable = () => {
  const [loading, setLoading] = useState(true);

  const [sendData, setSendData] = useState();
  const [teacher, setTeacher] = useState(1);
  const [teacherData, setTeacherData] = useState([]); //teacher dropdown list
  const [course, setCourse] = useState(1);
  const [courseData, setCourseData] = useState([]); //drop down course list
  const [tableData, setTableData] = useState([
    //Data for datagrid table
    {
      id: 1,
      std_name: "Snow",
      date: moment().format("DD-MM-YYYY"),
      attendance1: "P",
    },
    {
      id: 2,
      std_name: "Lannister",
      date: moment().format("DD-MM-YYYY"),
      attendance1: "P",
    },
    {
      id: 3,
      std_name: "Lanny",
      date: moment().format("DD-MM-YYYY"),
      attendance1: "A",
    },
    {
      id: 4,
      std_name: "Stark",
      date: moment().format("DD-MM-YYYY"),
      attendance1: "P",
    },
  ]);

  useEffect(() => {
    fetch(`/api/Std`)
      .then((res) =>
        res.json().then((json) => {
          console.log(json);
          json = json?.map((e) => Object.assign(e, { id: e.std_ID }));
          setTableData(
            json.map((e) => {
              return {
                id: e.id,
                std_name: e.std_name,
                teach_ID: 1,
                course_ID: 1,
                date: moment().format("DD-MM-YYYY"),
                attendance1: "A",
              };
            })
          );
        })
      )
      .catch((error) => console.log(error));

    fetch(`/api/Teach`)
      .then((res) =>
        res.json().then((json) => {
          console.log(json);
          setTeacherData(json);
        })
      )
      .catch((error) => console.log(error));
    fetch(`/api/Cor`)
      .then((res) =>
        res.json().then((json) => {
          setCourseData(json);
        })
      )
      .catch((error) => console.log(error));

    setLoading(false);
  }, []);

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setTableData(
      tableData.map((row) => (row.id === newRow.id ? updatedRow : row))
    );
    return updatedRow;
  };

  const handleTeacherChange = (event) => {
    setTeacher(event.target.value);
  };

  const handleCourseChange = (event) => {
    setCourse(event.target.value);
  };

  const handleSubmit = () => {
    let temp = [];
    tableData.forEach((e) => {
      temp.push({
        std_ID: e.id,
        teach_ID: teacher,
        course_ID: course,
        attendance1: e.attendance1,
        date: e.date,
      }); //)
    });

    // const temp1 = temp.map((e) => {
    //   delete e["id"];
    //   delete e["isNew"];
    //   return e;
    // });

    console.log(temp);
    putData(temp);
  };

  const putData = (temp) => {
    console.log(temp);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(temp),
    };
    fetch(`/api/Att`, requestOptions).then((response) =>
      console.log(response.json())
    );
  };

  return (
    <Grid container alignItems="center" justify="center" sx={{ my: 3 }}>
      <Grid key="teacher" item xs={12} md={6} sx={{ my: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="teacher-label">Teacher</InputLabel>
          <Select
            labelId="teacher-label"
            id="teacher-select"
            value={teacher}
            label="Teacher"
            onChange={handleTeacherChange}
          >
            {teacherData.map((e) => (
              <MenuItem key={e.teach_ID} value={e.teach_ID}>
                {e.teach_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid key="course" item xs={12} md={6} sx={{ my: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="course-label">Course</InputLabel>
          <Select
            labelId="course-label"
            id="course-select"
            value={course}
            label="Course"
            onChange={handleCourseChange}
          >
            {
              /*courseData.*/ courseData.map((e) => (
                <MenuItem key={e.course_ID} value={e.course_ID}>
                  {e.course_name}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Grid>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          //getRowId={(row) => row.id}
          rows={tableData}
          editMode="row"
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => console.log(error)}
          loading={loading}
        />
      </Box>

      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleSubmit()}
        sx={{ width: "50%", mx: "25%" }}
      >
        Update Sheet
      </Button>
    </Grid>
  );
};

export default AttendanceTable;
