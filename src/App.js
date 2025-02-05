import './App.css';
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
function App() {
  const [seminars, setSeminars] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/seminars") // Запрашиваем данные с json-server
      .then(response => response.json())  //переводим в формат json
      .then(data => setSeminars(data))
      .catch(error => console.error("Ошибка загрузки:", error));
  }, []);

  // Функция удаления семинара с подтверждением через sweetalert2
  const deleteSeminar = (seminar) => {
    Swal.fire({
      title: "Вы уверены?",
      text: `Вы хотите удалить "${seminar.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff6347",
      cancelButtonColor: "#5bc0de",
      
      confirmButtonText: "Да, удалить!",
      cancelButtonText: "Отмена",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:5000/seminars/${seminar.id}`, {
          method: "DELETE",
        })
          .then(() => {
            setSeminars(seminars.filter(s => s.id !== seminar.id));
            Swal.fire("Удалено!", "Семинар успешно удален.", "success");
          })
          .catch(error => {
            console.error("Ошибка удаления:", error);
            Swal.fire("Ошибка!", "Не удалось удалить семинар.", "error");
          });
      }
    });
  };
  // Функция редактирования семинара через sweetalert2
  const editSeminar = (seminar) => {
    Swal.fire({
      title: "Редактировать семинар",
      html: `
        <input id="title" class="swal2-input" placeholder="Название" value="${seminar.title}">
        <input id="description" class="swal2-input" placeholder="Описание" value="${seminar.description}">
        <input id="date" class="swal2-input" type="date" value="${seminar.date}">
        <input id="time" class="swal2-input" type="time" value="${seminar.time}">
      `,
      showCancelButton: true,
      confirmButtonText: "Сохранить",
      confirmButtonColor: "#5bc0de",
      cancelButtonText: "Отмена",
      preConfirm: () => {
        return {
          title: document.getElementById("title").value,
          description: document.getElementById("description").value,
          date: document.getElementById("date").value,
          time: document.getElementById("time").value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedSeminar = { ...seminar, ...result.value };

        fetch(`http://localhost:5000/seminars/${seminar.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSeminar),
        })
          .then(() => {
            setSeminars(seminars.map(s => s.id === seminar.id ? updatedSeminar : s));
            Swal.fire("Готово!", "Семинар обновлён.", "success");
          })
          .catch(error => {
            console.error("Ошибка обновления:", error);
            Swal.fire("Ошибка!", "Не удалось обновить семинар.", "error");
          });
      }
    });
  };
  
  return (
    <div className="App">
      <h1>Список семинаров:</h1>
        <div className="seminars-container">
        {seminars.map(seminar => (
          <div key={seminar.id} className="seminar-card">
            <h2>{seminar.title}</h2>
            <p>{seminar.description}</p>
            <p>Дата: {seminar.date}</p>
            <p>Время: {seminar.time}</p>
            <img src={seminar.photo} alt="seminar" />
            <br />
            <button className="delete-btn" onClick={() => deleteSeminar(seminar)}>DELETE</button>
            <button className="edit-btn" onClick={() => editSeminar(seminar)}>EDIT</button>
          </div>
        ))}
        </div>
    </div>
  );
}

export default App;