import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Grid } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import moment from "moment";

const columns = [
  { field: "std_ID", headerName: "ID", width: 90 },
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

const teachers = [
  { teach_ID: 1, teach_name: "Saif" },
  { teach_ID: 2, teach_name: "Bilal" },
  { teach_ID: 3, teach_name: "Abdul Rafay" },
];

const courses = [
  { course_ID: 1, course_name: "IPT" },
  { course_ID: 2, course_name: "Information Security" },
  { course_ID: 3, course_name: "PPIT" },
  { course_ID: 4, course_name: "OS" },
];

const AttendanceTable = () => {
  const [sendData, setSendData] = useState({});
  const [teacher, setTeacher] = useState(1);
  const [teacherData, setTeacherData] = useState([]); //teacher dropdown list
  const [course, setCourse] = useState(1);
  const [courseData, setCourseData] = useState([]); //drop down course list
  const [tableData, setTableData] = useState([
    //Data for datagrid table
    {
      std_ID: 1,
      std_name: "Snow",
      date: moment().format("DD-MM-YYYY"),
      attendance1: "P",
    },
    {
      std_ID: 2,
      std_name: "Lannister",
      date: moment().format("DD-MM-YYYY"),
      attendance1: "P",
    },
    {
      std_ID: 3,
      std_name: "Lanny",
      date: moment().format("DD-MM-YYYY"),
      attendance1: "A",
    },
    {
      std_ID: 4,
      std_name: "Stark",
      date: moment().format("DD-MM-YYYY"),
      attendance1: "P",
    },
  ]);

  useEffect(() => {
    //Abdul Rafay uncomment this while integration
    // fetch("/api/Std")
    //   .then((res) => {
    //     setTableData(
    //       res.map((e) => {
    //         return {
    //           std_ID: e.std_ID,
    //           std_name: e.std_name,
    //           teach_ID: 1,
    //           course_ID: 1,
    //           date: moment().format("DD-MM-YYYY"),
    //           attendance1: "",
    //         };
    //       })
    //     );
    //   })
    //   .catch((error) => console.log(error));
    // fetch("/api/Teach")
    //   .then((res) => {
    //     setTeacherData(res);
    //   })
    //   .catch((error) => console.log(error));
    // fetch("/api/Cor")
    //   .then((res) => {
    //     setCourseData(res);
    //   })
    //   .catch((error) => console.log(error));
  }, []);

  const processRowUpdate = (newRow) => {
    setTableData(
      tableData.map((row) =>
        row.std_ID === newRow.std_ID && row.date === newRow.date ? newRow : row
      )
    );
  };

  const handleTeacherChange = (event) => {
    setTeacher(event.target.value);
  };

  const handleCourseChange = (event) => {
    setCourse(event.target.value);
  };

  const handleSubmit = async () => {
    setSendData(
      tableData.map((e) => {
        return {
          std_ID: e.std_ID,
          teach_ID: teacher,
          course_ID: course,
          attendance1: e.attendance1,
          date: e.date,
        };
      })
    );

    putData();
  };

  const putData = () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sendData),
    };
    fetch(`/api/Att/${1}`, requestOptions).then((response) =>
      console.log(response.json())
    );
  };

  return (
    <Grid container alignItems="center" justify="center" sx={{ my: 3 }}>
      <Grid item xs={12} md={6} sx={{ my: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="teacher-label">Teacher</InputLabel>
          <Select
            labelId="teacher-label"
            id="teacher-select"
            value={teacher}
            label="Teacher"
            onChange={handleTeacherChange}
          >
            {
              /*teacherData.*/ teachers.map((e) => (
                <MenuItem key={e} value={e.teach_ID}>
                  {e.teach_name}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} sx={{ my: 2 }}>
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
              /*courseData.*/ courses.map((e) => (
                <MenuItem key={e} value={e.course_ID}>
                  {e.course_name}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Grid>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          getRowId={(row) => row.std_ID}
          rows={tableData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => console.log(error)}
        />
      </Box>

      <Button
        variant="contained"
        color="secondary"
        onClick={handleSubmit}
        sx={{ width: "50%", mx: "25%" }}
      >
        Update Sheet
      </Button>
    </Grid>
  );
};

export default AttendanceTable;
