import { cartService, userService } from "../repositories/index.js";


class UserController {
  constructor() {
    this.userService = userService
    this.cartService = cartService
  }

  getUsers = async (req, res) => {
    try {
      const users = await this.userService.getUsers();
      res.send(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor al obtener usuarios",
      });
    }
  };

  createUser = async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      const newUser = new UserDto({
        first_name,
        last_name,
        email,
        password,
      });

      const result = await this.userService.createUser(newUser);
      const newCart = await this.cartService.create({ products: [] });
      await this.userService.updateUser(newUser._id, newCart._id);

      res.status(201).json({
        status: "success",
        message: `El usuario ${first_name} ${last_name} ha sido creado con éxito`,
        user: result,
        cart: newCart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor al crear usuario",
      });
    }
  };

  getUserById = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await this.userService.getUserById({ _id: uid });
      res.json({
        status: "success",
        message: `Usuario ${user.first_name} ${user.last_name} id "${uid}" encontrado`,
        result: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor al obtener usuario por ID",
      });
    }
  };

  updateUser = async (req, res) => {
    try {
      const { uid } = req.params;
      const userToUpdate = req.body;
      const result = await this.userService.updateUser(uid, userToUpdate);
      res.status(200).json({
        status: "success",
        message: `El usuario ${result.first_name} ${result.last_name} con id "${uid}" ha sido actualizado`,
        result: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor al actualizar usuario",
      });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const { uid } = req.params;
      const result = await this.userService.deleteUser(uid);
      res.status(200).json({
        status: "success",
        message: `El usuario con id "${uid}" ha sido eliminado`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor al eliminar usuario",
      });
    }
  };
}

export default UserController;
