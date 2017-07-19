<?php
/*
 * Template Name: Spilltration Page
 * Description: A Product Brand Page Template with a section for product features
 */

$context = Timber::get_context();
$post = new TimberPost();
$context['post'] = $post;
Timber::render( array( 'template-spilltration.twig' ), $context );