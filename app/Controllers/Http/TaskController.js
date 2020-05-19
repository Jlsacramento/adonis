"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Task = use("App/Models/Task");

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response, params }) {
    const tasks = await Task.query()
      .where("project_id", params.projects_id)
      .with("user")
      .fetch();

    if (tasks.rows == "") {
      return response.status(404).send({
        error: { message: "Não há tarefas a serem listadas." },
      });
    }

    return tasks;
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, params }) {
    const data = request.only([
      "user_id",
      "title",
      "description",
      "due_date",
      "file_id",
    ]);

    const task = await Task.create({ ...data, project_id: params.projects_id });

    return task;
  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    try {
      const task = await Task.findOrFail(params.id);

      return task;
    } catch (error) {
      return response.status(error.status).send({
        error: { message: "Tarefa não encontrada, tente novamente." },
      });
    }
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    try {
      const task = await Task.findOrFail(params.id);

      const data = request.only([
        "user_id",
        "title",
        "description",
        "due_date",
        "file_id",
      ]);

      task.merge(data);

      await task.save();

      return task;
    } catch (error) {
      return response.status(error.status).send({
        error: { message: "Tarefa não encontrada, tente novamente." },
      });
    }
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {
    try {
      const task = await Task.findOrFail(params.id);

      await task.delete();
    } catch (error) {
      return response.status(404).send({
        error: { message: "Tarefa não encontrada, tente novamente." },
      });
    }
  }
}

module.exports = TaskController;
