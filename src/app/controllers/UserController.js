import User from '../models/User';

class UserController {
  async show(req, res) {
    if (req.userId) {
      const user = await User.findByPk(req.userId);

      if (user) {
        const { name, email } = user;
        return res.status(200).json({
          name,
          email,
        });
      }

      return res.status(404).json({ error: 'Usuário inexistente.' });
    }

    return res.status(400).json({ error: 'Por favor informe o usuário' });
  }

  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'O email já está cadastrado.' });
    }

    const { id, name, email, admin } = await User.create(req.body);

    return res.json({ id, name, email, admin });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'O email já está cadastrado.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'A senha está incorreta!' });
    }

    await user.update(req.body);

    return res.status(201).json(true);
  }
}

export default new UserController();
