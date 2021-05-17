const httpError = require('../models/error');

const marketing = require('../models/marketing');
const projet = require('../models/projet')

const { validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');



const ajout = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next
            (new httpError('invalid input passed ', 422));

    }

    const { prix, cout, duree, idProjet } = req.body;

    let existingProjet
    try {
        existingProjet = await projet.findById(idProjet)
    } catch {
        return next
            (new httpError('failed ', 500));
    }

    const createdMarketing = new marketing({

        prix,
        cout,
        duree

    });

    try {
        await createdMarketing.save();
        existingProjet.marketings.push(createdMarketing)
        await existingProjet.save()
    } catch (err) {
        const error = new httpError('failed signup', 500);
        return next(error);
    }

    res.status(201).json({ createdMarketing });

}

const updateMarketing = async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return next
            (new httpError('invalid input passed ', 422));

    }
    const id = req.params.id
    const { prix, cout, duree } = req.body;

    let existingMarketing
    try {
        existingMarketing = await marketing.findById(id)
    } catch {
        return next
            (new httpError('failed ', 500));
    }

    existingMarketing.prix = prix
    existingMarketing.cout = cout
    existingMarketing.duree = duree

    try {
        existingMarketing.save()
    } catch (err) {
        const error = new httpError('failed signup', 500);
        return next(error);
    }

    res.status(201).json({ existingMarketing });

}

const getMarketing = async (req, res, next) => {
    let existingMarketing;
    try {
        existingMarketing = await marketing.find()
    } catch {
        const error = new httpError('failed signup', 500);
        return next(error);
    }
    res.json({ existingMarketing })
}

const getMarketingById = async (req, res, next) => {
    const id = req.params.id
    let existingMarketing;
    try {
        existingMarketing = await marketing.findById(id)
    } catch {
        const error = new httpError('failed signup', 500);
        return next(error);
    }
    res.json({ existingMarketing })
}

const deleteMarketing = async (req, res, next) => {
    const id = req.params.id
    let existingMarketing;
    try {
        existingMarketing = await marketing.findById(id)
    } catch {
        return next
            (new httpError('failed ', 500));
    }
    if (!existingMarketing) {
        return next
            (new httpError('user does not exist ', 500));
    }
    try {
        existingMarketing.remove()
    } catch {
        return next
            (new httpError('failed ', 500));
    }
    res.status(200).json({ message: "deleted" })
}

exports.ajout = ajout
exports.updateMarketing = updateMarketing
exports.getMarketing = getMarketing
exports.getMarketingById = getMarketingById
exports.deleteMarketing = deleteMarketing

