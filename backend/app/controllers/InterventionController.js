const { Interventions } = require("../models");
const { Users } = require("../models");
const { Scales } = require("../models");
const { Op, fn, col, literal, QueryTypes, Sequelize } = require("sequelize");
const rawQueries = require('../../config/rawQueries');
const moment = require('moment');
require('moment-precise-range-plugin');



module.exports = {
  async index(req, res) {
    try {
      const interventions = await Interventions.findAll();

      return res.json(interventions);
    } catch (error) {
      console.error(error); 
    }
  },

  async store(req, res) {
    const {login, password, scale, observation } = req.body;
    const date = new Date();
    let date_time_intervention = moment().format();

    const loginExists = await Users.findOne({
      where: { login }
    });

    if (!loginExists) {
      return res.status(403).json(
        {
          attention: "Usuário informado não existe. Por favor, informe verifique."
        }
      );
    }

    const loginFinded = await Users.findOne({
      where: { 
        [Op.and]: [
          { login },
          { password }
        ]
      }
    });

    if (!loginFinded) {
      return res.status(403).json(
        { 
          attention: "Você digitou a senha incorreta. Tente novamente."
        }
      );
    }  

    const scaleFinded = await Scales.findOne({
      where: { 
        id: scale
      }
    });

    if (!scaleFinded) {
      return res.status(403).json(
        { 
          attention: "Balança informada não encontrada. Verifique."
        }
      );
    } 
    
    const InterventionCreated = await Interventions.create(
      {
        userId: loginFinded.id,
        scaleId: scaleFinded.id,
        date_time_intervention,
        observation
      }
    );

    return res.json(
      { 
        success: "Intervenção registrada com sucesso."
      }
    );
  },

  async show(req, res) {
    const { scaleId } = req.params;

    const [{ date_time_intervention }] = await  rawQueries.query(
      `SELECT date_time_intervention FROM "Interventions" 
          WHERE "scaleId" = ${scaleId} 
        ORDER BY id DESC LIMIT 1`, 
      {
        type: QueryTypes.SELECT
      }
    );

    let date_time_last_intervention = moment.utc(date_time_intervention).local().format();

    let date_now = moment().format();

    let diff = moment.preciseDiff(date_time_last_intervention, date_now, true); 
    
    return res.json(diff);
  }
};
